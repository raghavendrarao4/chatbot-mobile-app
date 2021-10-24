import Cookies from 'universal-cookie';

export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "Email can't be empty"
  if (!re.test(email)) return 'Please enter valid email address.'
  fetch('http://localhost:8080/api/userprofile?email=' + email)
    .then((response) => response.json())
    .then((json) => {
      if(json != "") {
        const cookies = new Cookies();
        cookies.set('userID', json[0].id, { path: '/' });
        cookies.set('questionnaireID', json[0].questionnaireID, { path: '/' });
        cookies.set('userData', JSON.stringify(json[0]), {path: '/'});
      }
      return ''
    })
    .catch((error) => {
      console.info(error);
    });
  return ''
}