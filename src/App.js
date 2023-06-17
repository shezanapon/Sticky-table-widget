import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import "./App.css";
import LaborTable from "./components/LaborTable";

const ZOHO = window.ZOHO;

function App() {
  const [zohoLoaded, setZohoLoaded] = useState(false);
  const [laborData, setLaborData] = useState([]);

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {});
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
        const data = await ZOHO.CRM.API.getAllRecords({
          Entity: "Project_Labor",
          sort_order: "asc",
          per_page: 100,
          page: 1,
        });
        setLaborData(data.data);
      }
    }
    getData();
  }, [zohoLoaded]);

  const renderNoData = () => (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 400,
      }}
    >
      <Box>
        <Typography variant="h1" align="center">
          No Data Found
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload(false)}
        >
          Refresh
        </Button>
      </Box>
    </Box>
  );

  const renderError = () => (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: 400,
      }}
    >
      <Typography variant="h1" align="center">
        <span style={{ color: "#3f51b5", fontWeight: 700 }}>ZOHO</span> is
        currently{" "}
        <span style={{ color: "#F44336", fontWeight: 700 }}>busy</span>, or
        something wrong with your internet connection. Please wait or{" "}
        <span style={{ color: "#4CAF50", fontWeight: 700 }}>try again</span>
        ..
      </Typography>
    </Box>
  );

  return (
    <div
      style={{ width: "100%", overflowY: "scroll", scrollbarColor: "#b51f3f" }}
    >
      {zohoLoaded ? (
        laborData.length > 0 ? (
          <LaborTable laborData={laborData} />
        ) : (
          renderNoData()
        )
      ) : (
        renderError()
      )}
    </div>
  );
}

export default App;
