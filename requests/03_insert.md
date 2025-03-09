# 03 insert

## バルクインサート

```http
POST {{host}}/_bulk
Content-Type: application/x-ndjson
Authorization: Basic {{user}}:{{password}}

{ "create": { "_index": "articles", "_id": "BK-001" } }
{ "title": "テストタイトル", "summary": "テストサマリー", "path": "lo" }
```