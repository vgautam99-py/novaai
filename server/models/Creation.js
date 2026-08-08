import mongoose from 'mongoose';

const creationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['article', 'blog-title', 'image', 'resume-review'],
      required: true,
    },
    publish: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: [String], // Array of User IDs who liked this creation
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Creation = mongoose.model('Creation', creationSchema);
export default Creation;
