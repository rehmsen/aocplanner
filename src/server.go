package aocplanner

import (
  "net/http"
  "github.com/go-martini/martini"
)

func init() {
  m := martini.Classic()
  m.Use(martini.Static("client/"))
  http.Handle("/", m)
}
