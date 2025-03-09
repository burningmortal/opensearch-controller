# OpenSearch Request Utilities

## ヘルスチェック

```http
GET {{host}}/_cluster/health
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

## 全検索

```http
GET {{host}}/_search
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "query": {
    "match_all": {}
  }
}
```