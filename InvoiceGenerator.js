import React,{useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import{ faTrash }  from "@fortawesome/free-solid-svg-icons";
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.vfs; 
const InvoiceGenerator=()=>{
    const [invoice, setInvoice] = useState({
        customerName: "",
        address: "",
        email: "",
        contactNo: "",
        products: [{ name: "", price: "", qty: "" }],
        additionalDetails: "",
      });
        // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInvoice({ ...invoice, [name]: value });
      };
      // Handle Product Change
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...invoice.products];
    updatedProducts[index][name] = value;
    setInvoice({ ...invoice, products: updatedProducts });
  };
   // Add New Product Row
   const addProduct = () => {
    setInvoice({
      ...invoice,
      products: [...invoice.products, { name: "", price: "", qty: "" }],
    });
  };
  // Delete a Product
  const deleteProduct = (index) => {
    const newProducts = invoice.products.filter((_, i) => i !== index);
    setInvoice({ ...invoice, products: newProducts });
  };
  // Validation Function
  const isFormValid = () => {
    const { customerName, address, email, contactNo, products } = invoice;

    // Check if required fields are filled
    if (!customerName || !address || !email || !contactNo) return false;

    // Check if at least one product has valid price & quantity
    return products.some((p) => p.name && p.price > 0 && p.qty > 0);
  };
  // Generate PDF Invoice
  const generatePDF = (action = "open") => {
    if (!isFormValid()) {
      alert("Please fill in all required fields before generating the invoice.");
      return;
    }
    const docDefinition = {
      content: [
        { text: "FLOWER SHOP", fontSize: 16, alignment: "center", color: "#047886" },
        { text: "INVOICE", fontSize: 20, bold: true, alignment: "center", decoration: "underline", color: "skyblue" },
        { text: "Customer Details", style: "sectionHeader" },
        {
          columns: [
            [
              { text: invoice.customerName, bold: true },
              { text: invoice.address },
              { text: invoice.email },
              { text: invoice.contactNo }
            ],
            [
              { text: `Date: ${new Date().toLocaleString()}`, alignment: "right" },
              { text: `Bill No : ${Math.floor(Math.random() * 1000)}`, alignment: "right" }
            ]
          ]
        },
        { text: "Order Details", style: "sectionHeader" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto"],
            body: [
              ["Product", "Price", "Quantity", "Amount"],
              ...invoice.products.map(p => [p.name, p.price, p.qty, (p.price * p.qty).toFixed(2)]),
              [{ text: "Total Amount", colSpan: 3 }, {}, {}, invoice.products.reduce((sum, p) => sum + (p.qty * p.price), 0).toFixed(2)]
            ]
          }
        },
        { text: "Additional Details", style: "sectionHeader" },
        { text: invoice.additionalDetails, margin: [0, 0, 0, 15] },
        { columns: [[{ text: "Signature", alignment: "right", italics: true }]] },
        { text: "Terms and Conditions", style: "sectionHeader" },
        {
          ul: [
            "Order can be returned in max 10 days.",
            "Warranty of the product will be subject to the manufacturer terms and conditions.",
            "This is a system-generated invoice."
          ]
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: "underline",
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      }
    };

    if (action === "download") {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === "print") {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  };
  


    return(
          <>
    
      {/* Navbar */}
      <nav className="navbar navbar-expand-sm navbar-dark bg-info d-flex justify-content-between">
        <a className="navbar-brand" href="https://www.youtube.com/@MrVinodh/featured" target="blank">❀⊱INVOICE GENERATOR⊰❀</a>
        <a className="text-white" href="https://github.com/VISHWAAYYASAMI" target="_blank" rel="noopener noreferrer">
          <i className="fa fa-github fa-2x"></i>
        </a>
      </nav>
      {/* Invoice Form */}
      <div className="container-fluid pt-2 mb-5">
        <div className="row">
          <div className="col-md-8">
            {/* Customer Details */}
            <div className="card border-info">
              <div className="card-body">
                <h4 className="card-title">Customer Details</h4>
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" className="form-control" name="customerName" value={invoice.customerName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <textarea className="form-control" name="address" value={invoice.address} onChange={handleChange} required></textarea>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" className="form-control" name="email" value={invoice.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Contact No.</label>
                      <input type="number" className="form-control" name="contactNo" value={invoice.contactNo} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>
            </div>
             {/* Order Details */}
             <div className="card border-info mt-2 mx-2">
              <div className="card-body">
                <h4 className="card-title d-flex justify-content-between">
                  Order Details <button className="btn btn-info" onClick={addProduct}>+</button>
                </h4>
                <div className="row">
                <table className="table">
                  <thead>
                    <tr>
                      <th width="25%">Product</th>
                      <th width="25%">Price</th>
                      <th width="25%">Quantity</th>
                      <th width="25%">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.products.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <input type="text" className="form-control" name="name" value={product.name} onChange={(e) => handleProductChange(index, e)} required />
                        </td>
                        <td>
                          <input type="number" className="form-control" name="price" value={product.price} onChange={(e) => handleProductChange(index, e)} required />
                       </td>
                        <td>
                          <input type="number" className="form-control" name="qty" value={product.qty} onChange={(e) => handleProductChange(index, e)} required />
                        </td>
                        <td>{product.price * product.qty || ''}</td>
                        <td><button className="btn btn-info btn-sm p-1" onClick={() => deleteProduct(index)}><FontAwesomeIcon icon={faTrash} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
              {/* Additional Details */}
            <div className="card border-info mt-2 mx-2">
              <div className="card-body">
                <h4 className="card-title">Additional Details</h4>
                <textarea className="form-control" name="additionalDetails" rows="3" value={invoice.additionalDetails} onChange={handleChange}></textarea>
              </div>
            </div>
           {/* Buttons */}
           <div className="container">
  <div className="row justify-content-center mt-3">
    <div className="col-12 col-md-4 mb-2">
      <button className="btn btn-info btn-lg w-100" onClick={() => generatePDF("download")} disabled={!isFormValid()}>
        Download Invoice
      </button>
    </div>
    <div className="col-12 col-md-4 mb-2">
      <button className="btn btn-info btn-lg w-100" onClick={() => generatePDF("print")} disabled={!isFormValid()}>
        Print Invoice
      </button>
    </div>
    <div className="col-12 col-md-4 mb-2">
      <button className="btn btn-info btn-lg w-100" onClick={() => generatePDF("open")} disabled={!isFormValid()}>
        Open Invoice
      </button>
    </div>
  </div>
</div>
{/* Footer */}
      <footer className="bottom">
        <div className=" text-center p-2 mt-2"> 
          <div className="">
        <h6>Made with 🌷by <a className="text-info follow-button"  href="https://www.instagram.com/vishwa_vs5/?hl=en" target="_blank" rel="noopener noreferrer"><i className="fa fa-instagram"></i> Vishwa_VS_Develop</a>.</h6>
        </div>
        </div>
      </footer>
      </>
    )
}
export default InvoiceGenerator;