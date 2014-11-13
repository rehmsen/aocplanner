package hello

import (
  "net/http"
  "github.com/go-martini/martini"
)

func init() {
  m := martini.Classic()
  m.Use(martini.Static("dist"))
  http.Handle("/", m)
}
