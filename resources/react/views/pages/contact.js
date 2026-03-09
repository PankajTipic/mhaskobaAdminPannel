import React from "react";

const ContactUs = () => {
  return (
    <div
      style={{
        width: "300px",
        margin: "100px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        textAlign: "center",
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => alert("Close clicked!")}
        >
          &#10005;
        </button>
      </div>
      <h2 style={{ margin: "0 0 20px", fontSize: "20px", color: "#333" }}>
        Contact Us
      </h2>
      <form>
        <input
          type="text"
          placeholder="Name"
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        />
        <input
          type="email"
          placeholder="Email"
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        />
        <input
          type="tel"
          placeholder="Phone"
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        />
         <input
          type="what you want to talk"
          placeholder="Contact_us"
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            backgroundColor: "#58b48b",
            border: "none",
            borderRadius: "5px",
            color: "#fff",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
