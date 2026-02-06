import fs from "fs";
import path from "path";
import { exec } from "child_process";
import os from "os";

const TEMP_DIR = path.join(os.tmpdir(), "leetcode_runner");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

const run = (cmd) =>
  new Promise((res, rej) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return rej(stderr);
      res(stdout.trim());
    });
  });

function toJava(arg) {
  if (Array.isArray(arg)) {
    if (Array.isArray(arg[0])) {
      return `new int[][]{${arg.map(r => `{${r.join(",")}}`).join(",")}}`;
    }
    return `new int[]{${arg.join(",")}}`;
  }
  if (typeof arg === "string") return `"${arg}"`;
  if (typeof arg === "boolean") return arg;
  return arg;
}

export async function runJava(code, testCases) {
  const results = [];

  for (const tc of testCases) {
    try {
      const inputs = JSON.parse(tc.input);
      const javaArgs = inputs.map(toJava).join(", ");

      const fullCode = `
import java.util.*;

class Solution {
${code}
}

public class Main {
  public static void main(String[] args) {
    Object res = Solution.solution(${javaArgs});
    if (res instanceof int[])
      System.out.print(Arrays.toString((int[]) res));
    else if (res instanceof int[][])
      System.out.print(Arrays.deepToString((int[][]) res));
    else
      System.out.print(res);
  }
}
`;

      const file = path.join(TEMP_DIR, "Main.java");
      fs.writeFileSync(file, fullCode);

      await run(`javac "${file}"`);
      const output = await run(`java -cp "${TEMP_DIR}" Main`);

      results.push({
        input: tc.input,
        expected: tc.output,
        output,
        passed:
          output.replace(/\s/g, "") ===
          JSON.stringify(tc.output).replace(/\s/g, "")
      });

    } catch (e) {
      results.push({
        input: tc.input,
        expected: tc.output,
        output: "Runtime Error",
        passed: false
      });
    }
  }

  return results;
}
