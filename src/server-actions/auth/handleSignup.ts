"use server";

const handleSignup = (formData: FormData) => {
  const userObj = {
    firstName: formData.get("firstName")?.toString(),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    gender: formData.get("gender"),
  };

  if (Object.values(userObj).some((value) => !value)) {
    return; // returning function if any of key is empty
  }

  console.log(userObj);
};

export default handleSignup;
