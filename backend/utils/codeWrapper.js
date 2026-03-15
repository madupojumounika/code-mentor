import fs from "fs";
import path from "path";
import { exec } from "child_process";
import os from "os";

const TEMP_DIR = path.join(os.tmpdir(), "leetcode_runner");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const runCommand = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, { timeout: 8000 }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout.trim());
    });
  });

const normalize = (v) =>
  String(v).replace(/\s+/g, "").trim();

const compareOutputs = (actual, expected) => {
  try {
    return (
      JSON.stringify(JSON.parse(actual)) ===
      JSON.stringify(JSON.parse(expected))
    );
  } catch {
    return normalize(actual) === normalize(expected);
  }
};


export const runCode = async ({ language, code, testCases }, callback) => {

  const results = [];

  for (const tc of testCases) {

    const { input, output: expected } = tc;
    let actualOutput = "";

    try {

      const parsed = JSON.parse(input);

      /* JAVASCRIPT */

      if (language === "javascript") {

        const file = path.join(TEMP_DIR, "solution.js");

const wrapped = `
class ListNode{
  constructor(val,next=null){
    this.val=val;
    this.next=next;
  }
}

function buildList(arr){
  let d=new ListNode(0),c=d;
  for(let v of arr){
    c.next=new ListNode(v);
    c=c.next;
  }
  return d.next;
}

function listToArray(head){
  let r=[];
  while(head){
    r.push(head.val);
    head=head.next;
  }
  return r;
}

class TreeNode{
  constructor(val,l=null,r=null){
    this.val=val;
    this.left=l;
    this.right=r;
  }
}

function buildTree(arr){
  if(!arr || !arr.length) return null;

  let root=new TreeNode(arr[0]);
  let q=[root];
  let i=1;

  while(q.length && i<arr.length){
    let node=q.shift();

    if(i<arr.length && arr[i]!=null){
      node.left=new TreeNode(arr[i]);
      q.push(node.left);
    }
    i++;

    if(i<arr.length && arr[i]!=null){
      node.right=new TreeNode(arr[i]);
      q.push(node.right);
    }
    i++;
  }

  return root;
}

${code}

try{

  let args = ${input};
  let normalized = args;

  if(Array.isArray(args) && args.length===1 && Array.isArray(args[0])){
    let arr = args[0];

    if(arr.includes(null)){
      normalized=[buildTree(arr)];
    }

    if(${JSON.stringify(code)}.includes("ListNode")){
      normalized=[buildList(arr)];
    }
  }

  /* detect user function name */

  const match = ${JSON.stringify(code)}.match(/function\\s+([a-zA-Z0-9_]+)/);

  if(!match){
    console.log("Runtime Error");
    process.exit();
  }

  const fnName = match[1];

  if(typeof eval(fnName) !== "function"){
    console.log("Runtime Error");
    process.exit();
  }

  const fn = eval(fnName);

  let result = fn(...normalized);

  if(result === undefined){
    console.log("Runtime Error");
    process.exit();
  }

  if(result instanceof ListNode){
    console.log(JSON.stringify(listToArray(result)));
  }
  else{
    console.log(JSON.stringify(result));
  }

}catch(e){
  console.log("Runtime Error");
}
`;

        fs.writeFileSync(file, wrapped);
        actualOutput = await runCommand(`node "${file}"`);
      }

      /* PYTHON */

      else if (language === "python") {

        const file = path.join(TEMP_DIR, "solution.py");
        const safeInput = input.replace(/'/g, "\\'");

        const wrapped = `
import json

class ListNode:
    def __init__(self,val,next=None):
        self.val=val; self.next=next

def buildList(arr):
    d=ListNode(0); c=d
    for v in arr:
        c.next=ListNode(v); c=c.next
    return d.next

def listToArray(head):
    r=[]
    while head:
        r.append(head.val); head=head.next
    return r

class TreeNode:
    def __init__(self,val,l=None,r=None):
        self.val=val; self.left=l; self.right=r

def buildTree(arr):
    if not arr: return None
    root=TreeNode(arr[0])
    q=[root]; i=1
    while q and i<len(arr):
        n=q.pop(0)
        if i<len(arr) and arr[i] is not None:
            n.left=TreeNode(arr[i]); q.append(n.left)
        i+=1
        if i<len(arr) and arr[i] is not None:
            n.right=TreeNode(arr[i]); q.append(n.right)
        i+=1
    return root

${code}

try:
    args=json.loads('${safeInput}')
    normalized=args

    if isinstance(args,list) and len(args)==1 and isinstance(args[0],list):
        arr=args[0]
        if None in arr or "TreeNode" in str(solution):
            normalized=[buildTree(arr)]

    fn=[v for k,v in globals().items() if callable(v) and k not in ["buildTree","buildList","listToArray"]][-1]
    res=fn(*normalized)

    if isinstance(res,ListNode):
        print(json.dumps(listToArray(res)))
    else:
        print(json.dumps(res))

except:
    print("Runtime Error")
`;

        fs.writeFileSync(file, wrapped);
        actualOutput = await runCommand(`python "${file}"`);
      }
/*  JAVA  */

else if (language === "java") {

  const solutionFile = path.join(TEMP_DIR, "Solution.java");
  const mainFile = path.join(TEMP_DIR, "Main.java");

  let finalCode = code;

  if (!code.includes("class Solution")) {
    finalCode =
`import java.util.*;
public class Solution {
${code}
}`;
  } else {
    finalCode =
`import java.util.*;
${code}`;
  }

  fs.writeFileSync(solutionFile, finalCode);

const argsString = parsed.map(v => {

  if (Array.isArray(v)) {

    if (Array.isArray(v[0]) && typeof v[0][0] === "boolean") {
      return "new boolean[][]{" +
        v.map(r => "{" + r.join(",") + "}").join(",") +
      "}";
    }


    if (Array.isArray(v[0]) && typeof v[0][0] === "string") {
      return "new String[][]{" +
        v.map(r => "{" + r.map(c => '"' + c + '"').join(",") + "}").join(",") +
      "}";
    }

    if (Array.isArray(v[0])) {
      return "new int[][]{" +
        v.map(r => "{" + r.join(",") + "}").join(",") +
      "}";
    }

    if (v.includes(null) || code.includes("TreeNode")) {
      const arr = v.map(x => x === null ? "null" : x).join(",");
      return "buildTree(new Integer[]{" + arr + "})";
    }

    if (code.includes("ListNode")) {
      return "buildList(new int[]{" + v.join(",") + "})";
    }

    if (typeof v[0] === "string") {
      return "new String[]{" + v.map(s => '"' + s + '"').join(",") + "}";
    }

    if (typeof v[0] === "number" && v.some(n => String(n).includes("."))) {
      return "new double[]{" + v.join(",") + "}";
    }

    return "new int[]{" + v.join(",") + "}";
  }

  if (typeof v === "object" && v !== null) {
    const entries = Object.entries(v)
      .map(([k,val]) => `put("${k}",${val});`)
      .join("");
    return `(new java.util.HashMap<String,Integer>(){{${entries}}})`;
  }

  if (v === null) return "null";

  if (typeof v === "string") return '"' + v + '"';

  return v;

}).join(",");

const methodMatch = code.match(/public\s+(?:static\s+)?[^\s]+\s+([a-zA-Z0-9_]+)\s*\(/);
const methodName = methodMatch ? methodMatch[1] : "solution";

const argumentBuilder = "Object result = Solution." + methodName + "(" + argsString + ");";

  fs.writeFileSync(mainFile,
`import java.util.*;

class TreeNode{
  int val;
  TreeNode left,right;
  TreeNode(int x){val=x;}
}

class ListNode{
  int val;
  ListNode next;
  ListNode(int x){val=x;}
}

public class Main{

static TreeNode buildTree(Integer[] arr){

  if(arr.length==0 || arr[0]==null) return null;

  TreeNode root=new TreeNode(arr[0]);
  Queue<TreeNode> q=new LinkedList<>();
  q.add(root);

  int i=1;

  while(!q.isEmpty() && i<arr.length){

    TreeNode node=q.poll();

    if(i<arr.length && arr[i]!=null){
      node.left=new TreeNode(arr[i]);
      q.add(node.left);
    }
    i++;

    if(i<arr.length && arr[i]!=null){
      node.right=new TreeNode(arr[i]);
      q.add(node.right);
    }
    i++;
  }

  return root;
}

static ListNode buildList(int[] arr){

  ListNode dummy=new ListNode(0);
  ListNode cur=dummy;

  for(int v:arr){
    cur.next=new ListNode(v);
    cur=cur.next;
  }

  return dummy.next;
}

static List<List<Integer>> buildList2D(int[][] arr){
  List<List<Integer>> res = new ArrayList<>();
  for(int[] row : arr){
    List<Integer> r = new ArrayList<>();
    for(int v : row) r.add(v);
    res.add(r);
  }
  return res;
}

static String listToString(ListNode head){

  List<Integer> list=new ArrayList<>();

  while(head!=null){
    list.add(head.val);
    head=head.next;
  }

  return list.toString();
}

public static void main(String[] args){

  try{

    ${argumentBuilder}

    if(result instanceof ListNode){
      System.out.print(listToString((ListNode)result));
    }
    else if(result instanceof int[]){
      System.out.print(Arrays.toString((int[])result));
    }
    else if(result instanceof int[][]){
      System.out.print(Arrays.deepToString((int[][])result));
    }
    else if(result instanceof char[][]){
      System.out.print(Arrays.deepToString((char[][])result));
    }
    else if(result instanceof double[]){
      System.out.print(Arrays.toString((double[])result));
    }
      else if(result instanceof double[][]){
  System.out.print(Arrays.deepToString((double[][])result));
}
   else if(result instanceof boolean[][]){
    System.out.print(Arrays.deepToString((boolean[][])result));
    }
    else if(result instanceof boolean[]){
      System.out.print(Arrays.toString((boolean[])result));
    }
    else if(result instanceof Object[]){
      System.out.print(Arrays.deepToString((Object[])result));
    }
    else{
      System.out.print(String.valueOf(result));
    }

  }
  catch(Exception e){
    System.out.print("Runtime Error");
  }

}
}`);
  
  await runCommand('javac "' + solutionFile + '" "' + mainFile + '"');
  actualOutput = await runCommand('java -cp "' + TEMP_DIR + '" Main');
}
if(actualOutput === "Runtime Error"){
  results.push({
    input,
    expected,
    output: actualOutput,
    passed:false,
    status:"Runtime Error"
  });
}else{
  const passed = compareOutputs(actualOutput, expected);
  results.push({
    input,
    expected,
    output: actualOutput,
    passed,
    status: passed ? "Passed" : "Wrong Answer"
  });
}

    } catch (err) {
      results.push({
        input,
        expected,
        output: String(err),
        passed: false,
      });
    }
  }

  callback(results);
};