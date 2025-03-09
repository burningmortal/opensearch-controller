# 02 index

## インデックスマッピング設定

```http
PUT {{host}}/articles
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "settings": {
    "index.number_of_shards": 1
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text"
      },
      "summary": {
        "type": "text"
      },
      "path": {
        "type": "keyword"
      }
    }
  }
}
```