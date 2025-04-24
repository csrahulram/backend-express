import { Application, Request, Response, Router } from "express";

export const moduleHandler = (req: Request, res: Response) => {
    res.send('The module is ' + req.params.module);
}