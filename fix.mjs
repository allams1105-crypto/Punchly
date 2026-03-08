import { writeFileSync, readFileSync } from "fs";

let content = readFileSync("src/app/[locale]/login/page.tsx", "utf8");

content = content.replace(
  `Tu equipo,<br />
              siempre<br />
              en punto.`,
  `Tu equipo,<br />
              siempre<br />
              a tiempo.`
);

writeFileSync("src/app/[locale]/login/page.tsx", content);
console.log("Listo!");