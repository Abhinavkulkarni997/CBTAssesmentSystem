const mongoose = require("mongoose");

const examSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true
    },

    assignedQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      }
    ],

    answers: {
      type: Map,
      of: String,
      default: {}
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    submittedAt: Date,

    status: {
      type: String,
      enum: [
        "NotStarted",
        "InProgress",
        "Completed"
      ],
      default: "InProgress"
    },

    score: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports =
mongoose.model(
  "ExamSession",
  examSessionSchema
);