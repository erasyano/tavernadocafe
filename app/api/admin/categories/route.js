import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "public", "taverna-categories.json");

export async function GET() {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return new Response(data, { status: 200 });
  } catch {
    return new Response(JSON.stringify({ categories: [] }), { status: 200 });
  }
}

export async function POST(request) {
  try {
    const { categories } = await request.json();
    await fs.writeFile(DATA_PATH, JSON.stringify({ categories }, null, 2), "utf-8");
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Erro ao salvar" }), { status: 500 });
  }
}
