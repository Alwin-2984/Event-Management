// Function to generate initial form values based on 'signUp' and 'isOrganiser' props

export function initialValuesFunction(signUp, isOrganiser) {
  // Common initial form values for all cases
  const commonValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  // If the form is for sign-up
  if (signUp) {
    // Check if it's for an user
    if (!isOrganiser) {
      // Return initial values for user sign-up with additional fields 'dob' and 'gender'
      return {
        ...commonValues,
        dob: "",
        gender: "",
      };
    }

    // Return initial values for organiser sign-up without 'dob' and 'gender'
    return commonValues;
  }

  // If the form is for log-in, return initial values with only 'email' and 'password'
  return {
    email: "",
    password: "",
  };
}
