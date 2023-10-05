import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  let filename = req.url?.split("filename")[1].slice(1);
  if (!filename) {
    return res.status(400).json({ error: "FilDDename" });
  }
  const fileToRead = filename.toString();

  fs.readFile(fileToRead, "utf8", (err, data) => {
    if (!err) {
      return NextResponse.json({ content: data }, { status: 200 });
    }
    return NextResponse.json({ error: err }, { status: 500 });
  });

  return NextResponse.json(filename, { status: 200 });
};

export { handler as GET, handler as POST };
