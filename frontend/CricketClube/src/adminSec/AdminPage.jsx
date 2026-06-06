import React from "react";

import Anavbar from "./Anavbar";
import Footer from "../homeSec/Footer";
import AdminHome from "./AdminHome";

function AdminPage(){
    return(
        <>
        <Anavbar/>
        <AdminHome/>
        <Footer/>
        </>
    );
}

export default AdminPage;