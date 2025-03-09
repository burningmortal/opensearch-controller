# OpenSearch Request Utilities

## ヘルスチェック

```http
GET {{host}}/_cluster/health
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

## 全検索

```http
@index_name = articles

GET {{host}}/{{index_name}}/_search
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "query": {
    "match_all": {}
  }
}
```
