import { PrismaClient } from "@prisma/client";
import type { Bangumi } from "../types";

export class BangumiDB {
  prisma;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async set(key: string, bangumi: Bangumi[][]) {
    const value = JSON.stringify(bangumi);
    return await this.prisma.data.upsert({
      where: {
        key,
      },
      update: {
        value,
      },
      create: {
        key,
        value,
      },
    });
  }

  async get(key: string) {
    const resp = await this.prisma.data.findUnique({
      where: {
        key,
      },
    });
    if (resp) {
      return {
        ...resp,
        value: JSON.parse(resp.value) as Bangumi,
      };
    }
    return null;
  }

  async all() {
    return (await this.prisma.data.findMany()).map((item) => {
      return {
        ...item,
        value: JSON.parse(item.value) as Bangumi,
      };
    });
  }
}
