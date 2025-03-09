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