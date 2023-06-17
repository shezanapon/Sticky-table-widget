import { useEffect, useState } from "react";
import "./App.css";
import LaborTable from "./components/LaborTable/LaborTable";

const ZOHO = window.ZOHO;

function App() {
  const [projectData, setProjectData] = useState(null);
  const [painterData, setPainterData] = useState(null);
  const [hoursData, setHoursData] = useState(null);
  const [zohoLoaded, setZohoLoaded] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [jobOffers,setJobOffers] = useState([]);
  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      //Custom Bussiness logic goes here
      // console.log(data);
    });
    /*
     * initializing the widget.
     */
    ZOHO.embeddedApp.init().then(() => {
      setZohoLoaded(true);
    });
  }, []);

  useEffect(() => {
    async function getData() {
      if (zohoLoaded) {
        await ZOHO.CRM.API.searchRecord({
          Entity: "FP_Projects",
          Type: "criteria",
          Query:
            "(((Project_Status:equals:Requested)or(Project_Status:equals:In Progress)))",
        }).then(function (data) {
          // console.log("Project Data ", data);
          setProjectData(data?.data);
        });
        await ZOHO.CRM.API.searchRecord({
          Entity: "Contractors",
          Type: "criteria",
          Query:
            "(((Contractor_Status:equals:Active)and(Employment_Type:equals:Contractor)))",
        }).then(function (data) {
          // console.log("Painter Data ", data);
          setPainterData(data?.data);
        });

        await ZOHO.CRM.API.searchRecord({
          Entity: "FP_Invoice",
          Type: "criteria",
          Query: "(Invoice_Status:equals:Under Review)",
        }).then(function (data) {
          // console.log("Painter Data ", data);
          setInvoice(data?.data);
        });

        
      // let config = {
      //   select_query:
      //     "select Name from FP_Invoice where Invoice_Status	= 'Under Review'",
      // };
      // await ZOHO.CRM.API.coql(config).then(function (data) {
      //   console.log(data.data)
      // }); 
      
      let config = {
        select_query:
          "select Name,Total_Invoiced,FP_Projects,Contractor from Job_Offers where Job_Offer_Status	= 'Request Created'",
      };
      await ZOHO.CRM.API.coql(config).then(function (data) {
        setJobOffers(data.data)
      });

      }
    }
    getData();
  }, [zohoLoaded]);


  // console.log({jobOffers})

  return (
    <div style={{padding:"10px",height:"50vh"}}>
      {zohoLoaded && <LaborTable projectData={projectData} painterData={painterData} jobOffers={jobOffers} />}
    </div>
  );
}

export default App;
