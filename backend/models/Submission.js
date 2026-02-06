import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: { type: String },                
    problemId: { type: String, required: true }, 
    language: { type: String },
    code: { type: String },
    status: { type: String },                 
    passed: { type: Boolean },              
    pattern: { type: String },
    difficulty: { type: String },
  },
  { timestamps: true }
);

let Submission;
try {
  Submission = mongoose.model("Submission");
} catch (err) {
  Submission = mongoose.model("Submission", submissionSchema);
}

export default Submission;
