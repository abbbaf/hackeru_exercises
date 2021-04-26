const express = require("express");

const internalError = "An unexpected error occurred";

function send(res, message, statusCode) {
  if (typeof message === "object") res.status(statusCode).json(message);
  else res.status(statusCode).send(message);
}

function middleware(callback) {
  return async (req, res, next) => {
    try {
      res.badRequest = (message) => send(res, message, 400);
      res.notFound = (message) => send(res, message, 404);
      res.accessDenied = (message) => send(res,message,401);
      await callback(req, res, next);
    } catch (ex) {
      console.log(ex);
      res.status(500).send(internalError);
    }
  };
}

function Router(...args) {
  const router = express.Router(...args);
  const originalMethods = {};

  function handleRequest(path, method, callbacks) {
    const inner = (path, callbacks) => {
      originalMethods[method](path, ...callbacks.map(middleware));
    };
    return inner(path, callbacks);
  }

  const methods = ["get", "post", "put", "patch", "delete", "all"];

  for (let method of methods) {
    originalMethods[method] = router[method].bind(router);
    router[method] = function (path, ...callbacks) {
      return handleRequest(path, method, callbacks);
    };
  }

  return router;
}

module.exports = Router;
