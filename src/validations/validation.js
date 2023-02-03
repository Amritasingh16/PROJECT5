
const isValidName = function (name) {
    const nameRegex = /^[a-zA-Z ]{1,30}$/;
    return nameRegex.test(name)
}


const isValid = (value) => {
  if (typeof value === "undefined" || value === null || value === "") {
        return false
  }
  if (typeof value === "string" && value.trim().length > 0) {
        return true
    }
};


const isValidEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  const isValidNo = function (number) {
    const validnumber = /^[6-9]\d{9}$/;
    return validnumber.test(number);
  };

const isValidPassword = function (password) {
    var strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,15}$"
    );
    /*at least 1 lowercase, at least 1 uppercase, at least 1 numeric character,
      at least one special character, range between 8-12*/
    return strongRegex.test(password);
}

const isValidPin = function (pincode) {
    const validPin = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/;
    return validPin.test(pincode);
  };



  const isValidTitle = function(title){
    const validTitle= /^[a-z A-Z_]{3,20}$/
    return validTitle.test(title)
  }
  const isValidPrice =function(price) { 
    const validPrice= /^(?:0|[1-9]\d*)(?:\.(?!.*000)\d+)?$/
    return validPrice.test(price) }

  

module.exports={isValidName,isValidEmail,isValidNo,isValidPassword,isValidPin,isValid,isValidTitle,isValidPrice} 