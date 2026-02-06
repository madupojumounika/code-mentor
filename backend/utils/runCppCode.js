import fs from "fs";
import { exec } from "child_process";

const SRC = "./tmp/temp.cpp";
const OUT = "./tmp/a.out";

export function runCPP(code, testCases) {
  return new Promise(resolve => {
    const results = [];

    const wrapped = `
#include <bits/stdc++.h>
#include "json.hpp"
using json = nlohmann::json;
using namespace std;

${code}

int main(int argc, char* argv[]) {
  try {
    auto in = json::parse(argv[1]);
    auto res = solution(in);
    cout << res.dump();
  } catch (...) {
    cout << "Runtime Error";
  }
}
`;
    fs.writeFileSync(SRC, wrapped);

    exec(`g++ -std=c++17 "${SRC}" -o "${OUT}"`, err => {
      if (err) return resolve([]);

      const runOne = i => {
        if (i === testCases.length) return resolve(results);
        const tc = testCases[i];
        exec(`"${OUT}" '${tc.input}'`, (_, stdout) => {
          results.push({
            input: tc.input,
            expected: tc.output,
            output: stdout.trim()
          });
          runOne(i + 1);
        });
      };
      runOne(0);
    });
  });
}
