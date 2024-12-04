import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { IUser, UserModel } from './user.interface';
import { USER_ROLE } from './user.constants';

const userSchema = new Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: [USER_ROLE.admin, USER_ROLE.customer, USER_ROLE.vendor],
      default: USER_ROLE.customer,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
    },
    status: {
      type: String,
      enum: ['active', 'diactive', 'blocked'],
      default: 'active',
    },
    followedVendors: {
      type: [Schema.Types.ObjectId],
      ref: 'Vendor',
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const hashedPassword = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
    );
    this.password = hashedPassword;
    next();
  } catch (error) {
    next();
  }
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
): boolean {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;

  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<IUser, UserModel>('User', userSchema);
