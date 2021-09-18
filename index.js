const onReject = (reject, ifscCode) => {
  document.getElementById("invalidCode").innerText = "Invalid IFSC Code:"+ifscCode;
  document.getElementById("bankName").innerText = "";
  document.getElementById("branchName").innerText = "";
  document.getElementById("address").innerText = "";
  document.getElementById("city").innerText = "";
  document.getElementById("state").innerText = "";
  document.getElementById("micr").innerText = "";
  document.getElementById("contactButton").style.visibility = "hidden";
  document.getElementById("contact").innerText = "";

  reject(
    JSON.stringify({
      error: "Invalid IFSC Code:" + ifscCode,
    })
  );
}

const onResolve = (resolve, output) => {
  document.getElementById("bankName").innerText = output.BANK;
  document.getElementById("branchName").innerText = output.BRANCH;
  document.getElementById("address").innerText = output.ADDRESS;
  document.getElementById("city").innerText = output.CITY;
  document.getElementById("state").innerText = output.STATE;
  document.getElementById("micr").innerText = output.MICR;
  let contactNumber = output.CONTACT;

  sessionStorage.setItem(
    "bank-contact-details",
    window.btoa(contactNumber)
  );
  document.getElementById("contactButton").style.visibility = "visible";
  document.getElementById("contact").innerText = "";
  document.getElementById("invalidCode").innerText = "";
  resolve(output);
}

const getBankDetails = (ifscCode) => {
  return new Promise(async (resolve, reject) => {
    const url = "https://ifsc.razorpay.com/" + ifscCode;
    try {
      const rawResponse = await fetch(url, {
          method: 'GET',
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json;charset=UTF-8"
          }
      });
      if (rawResponse.ok) {
          const response = await rawResponse.json();
          onResolve(resolve, response);
      } else {
          const error = new Error();
          error.message = 'Something went wrong.';
          throw error;
      }
    } catch(e) {
        onReject(reject, ifscCode);
    }
  });
}

const getContactNumber = () => {
  const bankContactDetails = window.atob(
    sessionStorage.getItem("bank-contact-details")
  );
  document.getElementById("contact").innerText = bankContactDetails;
  document.getElementById("contactButton").style.visibility = "hidden";
}

if (typeof exports !== "undefined") {
  module.exports = {
    getBankDetails,
    getContactNumber,
  };
}
