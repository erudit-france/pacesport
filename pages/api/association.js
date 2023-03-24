import { createProxyMiddleware } from "http-proxy-middleware";
import httpProxyMiddleware from "next-http-proxy-middleware";
import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from 'nextjs-cors';

// For preventing header corruption, specifically Content-Length header
export const config = {
    api: {
        bodyParser: false,
    },
}

export default async (req, res) => {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });

    httpProxyMiddleware(req, res, {
        target: 'http://localhost:8080',
    })
}