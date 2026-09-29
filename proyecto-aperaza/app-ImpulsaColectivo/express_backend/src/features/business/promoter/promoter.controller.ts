import { Request, Response } from "express";
import { Promoter, PromoterI } from "./promoter.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class PromoterController {
  // ================== READ ==================
  // (rellenar en ISS-03-B) getAll, luego getOne
    public async getAll(req: Request, res: Response) {
    try {
      const promoters = await Promoter.findAll({
        where: { status: "active" },
      });
      res.status(200).json({ promoters });
    } catch (error) {
      res.status(500).json({ error: "Error fetching promoters", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const promoter = await Promoter.findByPk(id);
      if (!promoter) {
        res.status(404).json({ error: "Promoter not found" });
        return;
      }
      res.status(200).json({ promoter });
    } catch (error) {
      res.status(500).json({ error: "Error fetching promoter", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  // (rellenar en ISS-03-C)
    public async create(req: Request, res: Response) {
    try {
      const body = req.body as PromoterI;
      const promoter = await Promoter.create({
        name: body.name,
        description: body.description,
        contact_email: body.contact_email,
        contact_phone: body.contact_phone,
        status: body.status ?? "active",
      });
      res.status(201).json({ promoter });
    } catch (error) {
      res.status(500).json({ error: "Error creating promoter", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  // (rellenar en ISS-03-D)
    public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as PromoterI;
      const promoter = await Promoter.findByPk(id);
      if (!promoter) {
        res.status(404).json({ error: "Promoter not found" });
        return;
      }

      await promoter.update({
        name: body.name,
        description: body.description,
        contact_email: body.contact_email,
        contact_phone: body.contact_phone,
        status: body.status ?? promoter.status,
      });

      res.status(200).json({ promoter });
    } catch (error) {
      res.status(500).json({ error: "Error updating promoter (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<PromoterI>;
      const promoter = await Promoter.findByPk(id);
      if (!promoter) {
        res.status(404).json({ error: "Promoter not found" });
        return;
      }

      await promoter.update(body);
      res.status(200).json({ promoter });
    } catch (error) {
      res.status(500).json({ error: "Error updating promoter (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  // (rellenar en ISS-03-E)
}
