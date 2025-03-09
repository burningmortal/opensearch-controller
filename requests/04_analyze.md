# 04 analyze

## アナライザーの結果確認

```http

@index_name = articles

GET {{host}}/{{index_name}}/_analyze
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "text": "何卒ご理解賜りますようお願い申し上げます"
}
```

## インデックス作成 kuromoji使用

```http

@index_name = articles_analyze

PUT {{host}}/articles_analyze
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}

{
  "settings": {
    "index.number_of_shards": 1,
    "analysis": {
      "analyzer": {
        "default": {
          "type": "custom",
          "tokenizer": "kuromoji_tokenizer"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text"
      },
      "summary": {
        "type": "text"
      },
      "link": {
        "type": "keyword"
      },
      "author": {
        "type": "text"
      }
    }
  }
}
```

## インデックス削除

```http

@index_name = articles_analyze

DELETE {{host}}/{{index_name}}
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

## インデックスマッピング確認

```http

@index_name = articles

GET {{host}}/{{index_name}}/_mapping
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```

## プラグイン一覧

```http

GET {{host}}/_cat/plugins
Content-Type: application/json
Authorization: Basic {{user}}:{{password}}
```