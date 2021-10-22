export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "Email can't be empty"
  if (!re.test(email)) return 'Please enter valid email address.'
  fetch('http://localhost:8080/api/userprofile?email=' + email)
    .then((response) => response.json())
    .then((json) => {
      if(json!="");
      return ''
    })
    .catch((error) => {
      console.info(error);
    });
  return ''
}