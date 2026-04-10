#!/bin/bash
# CloudFront access log analyzer for skibti.com.
#
# Downloads the past N days of logs from s3://skibti-logs/cf/, unpacks them,
# and prints a report: total requests, unique visitors, top pages,
# personality match distribution, top referrers, geographic spread.
#
# Usage:
#   ./scripts/analytics.sh              # last 7 days
#   ./scripts/analytics.sh 1            # last 1 day
#   ./scripts/analytics.sh 30           # last 30 days

set -e

DAYS="${1:-7}"
BUCKET="skibti-logs"
PREFIX="cf/"
TMP_DIR="/tmp/skibti-logs"

echo "=== SKTI Analytics — last ${DAYS} days ==="
echo

# Clean and prepare temp dir
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"

# Compute cutoff date (logs are named E3PXHCWFXWR8N7.YYYY-MM-DD-HH.HASH.gz)
CUTOFF=$(date -u -v-"${DAYS}"d +%Y-%m-%d 2>/dev/null || date -u -d "${DAYS} days ago" +%Y-%m-%d)

echo "Downloading logs from ${CUTOFF} onward..."
aws s3 ls "s3://${BUCKET}/${PREFIX}" | awk -v cutoff="$CUTOFF" '$4 ~ /\.gz$/ && $1 >= cutoff {print $4}' | while read -r fn; do
  aws s3 cp "s3://${BUCKET}/${PREFIX}${fn}" "$TMP_DIR/" --quiet
done

cd "$TMP_DIR"
FILE_COUNT=$(ls -1 *.gz 2>/dev/null | wc -l | tr -d ' ')
if [ "$FILE_COUNT" -eq 0 ]; then
  echo "No log files found. CloudFront may take a few hours to deliver first logs after enabling."
  exit 0
fi
echo "Downloaded ${FILE_COUNT} log files."
echo

# Concatenate all logs, strip comments (#Version / #Fields lines)
gunzip -c *.gz 2>/dev/null | grep -v '^#' > all.log

TOTAL=$(wc -l < all.log | tr -d ' ')
echo "=== Summary ==="
echo "Total requests:   ${TOTAL}"

# CloudFront v1 log format, tab-separated.
# Field index (1-based):
#  1:date  2:time  3:x-edge-location  4:sc-bytes  5:c-ip  6:cs-method
#  7:cs(Host)  8:cs-uri-stem  9:sc-status  10:cs(Referer)
#  11:cs(User-Agent)  12:cs-uri-query  ...

# Unique visitors by IP
UNIQUE_IPS=$(awk -F'\t' '{print $5}' all.log | sort -u | wc -l | tr -d ' ')
echo "Unique IPs:       ${UNIQUE_IPS}"

# HTML requests only (for "page view" count)
HTML_HITS=$(awk -F'\t' '$8 ~ /(\.html$|\/$)/' all.log | wc -l | tr -d ' ')
echo "HTML page views:  ${HTML_HITS}"

# Unique visitors on HTML pages
HTML_VISITORS=$(awk -F'\t' '$8 ~ /(\.html$|\/$)/ {print $5}' all.log | sort -u | wc -l | tr -d ' ')
echo "HTML visitors:    ${HTML_VISITORS}"

# Test completions (requests to /result/[type]/)
TESTS=$(awk -F'\t' '$8 ~ /^\/result\// && $8 ~ /\.html$/' all.log | wc -l | tr -d ' ')
echo "Test completions: ${TESTS}"

echo
echo "=== Top pages ==="
awk -F'\t' '$8 ~ /(\.html$|\/$)/ {print $8}' all.log |
  sed 's|index\.html$||' |
  sort | uniq -c | sort -rn | head -15

echo
echo "=== Personality match distribution ==="
# result/<slug>.html or result/<slug>/ pages
awk -F'\t' '$8 ~ /^\/result\// && $8 ~ /\.html$/' all.log |
  awk -F'\t' '{print $8}' |
  sed -E 's|^/result/([^/.]+).*|\1|' |
  sort | uniq -c | sort -rn

echo
echo "=== Top referrers ==="
awk -F'\t' '$10 != "-" && $10 != "" {print $10}' all.log |
  sed -E 's|https?://||; s|/.*||' |
  sort | uniq -c | sort -rn | head -10

echo
echo "=== Top user agents (simplified) ==="
awk -F'\t' '{print $11}' all.log |
  sed -E 's|.*iPhone.*|iPhone|; s|.*Android.*|Android|; s|.*Macintosh.*|Mac|; s|.*Windows.*|Windows|; s|.*Linux.*|Linux|; s|.*bot.*|Bot|i' |
  awk '/^(iPhone|Android|Mac|Windows|Linux|Bot)$/' |
  sort | uniq -c | sort -rn

echo
echo "=== Requests by day ==="
awk -F'\t' '{print $1}' all.log | sort | uniq -c

echo
echo "=== Geography (via x-edge-location prefix) ==="
# Each CloudFront edge code ends in XXY where XX is airport code
awk -F'\t' '{print $3}' all.log | sed -E 's|^(...).*|\1|' | sort | uniq -c | sort -rn | head -10
