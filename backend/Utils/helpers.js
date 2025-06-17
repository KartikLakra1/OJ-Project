import becrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hashPassword = async (password) => {
  try {
    const salt = await becrypt.genSalt(8);
    const hashedPassword = await becrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log("Error Encourtered during hashing : ", error);
  }
};

const TokenGenerator = async (user) => {
  const payload = {
    _id: user._id,
    email: user.email,
  };

  const token = await jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY,
    { expiresIn: "4h" }
  );

  return token;
};

export { hashPassword ,TokenGenerator};


// // verify a token symmetric - synchronous
// var decoded = jwt.verify(token, 'shhhhh');
// console.log(decoded.foo) // bar

// // verify a token symmetric
// jwt.verify(token, 'shhhhh', function(err, decoded) {
//   console.log(decoded.foo) // bar
// });
