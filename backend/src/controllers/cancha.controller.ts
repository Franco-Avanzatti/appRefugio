import { Request, Response, NextFunction } from "express";
import { CanchaService } from "../services/cancha.service";

export class CanchaController {
  static async getCanchas(req: Request, res: Response, next: NextFunction) {
    try {
      const canchas = await CanchaService.getCanchas();
      res.json(canchas);
    } catch (err) {
      next(err);
    }
  }

  static async getCanchaById(req: Request, res: Response, next: NextFunction) {
    try {
      const cancha = await CanchaService.getCanchaById(req.params.id);
      res.json(cancha);
    } catch (err) {
      next(err);
    }
  }

  static async createCancha(req: Request, res: Response, next: NextFunction) {
    try {
      const cancha = await CanchaService.createCancha(req.body);
      res.status(201).json(cancha);
    } catch (err) {
      next(err);
    }
  }

  static async updateCancha(req: Request, res: Response, next: NextFunction) {
    try {
      const cancha = await CanchaService.updateCancha(
        req.params.id,
        req.body
      );

      res.json(cancha);
    } catch (err) {
      next(err);
    }
  }

  static async toggleEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const cancha = await CanchaService.toggleEstado(req.params.id);
      res.json(cancha);
    } catch (err) {
      next(err);
    }
  }

  static async deleteCancha(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CanchaService.deleteCancha(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}