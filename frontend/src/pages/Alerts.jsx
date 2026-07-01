import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import api from "../services/api";

function Alerts() {

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {

    try {

      const response = await api.get("/alerts");

      setAlerts(response.data || []);

    } catch (error) {

      console.log(error);

    }

  };
  return (

<MainLayout>

<div className="mb-8">

<h1 className="text-3xl font-bold">
Alerts
</h1>

<p className="text-gray-500 mt-1">
Insurance, Permit and License Expiry Alerts
</p>

</div>
<div className="bg-white rounded-2xl shadow-md overflow-hidden">

<div className="p-6 border-b">

<h2 className="text-xl font-semibold">

Total Alerts : {alerts.length}

</h2>

</div>

<div className="divide-y">
  {alerts.length > 0 ? (

alerts.map((alert,index)=>(

<div
key={index}
className="flex justify-between items-center p-5 hover:bg-red-50 border-l-4 border-red-500"
>

<div>

<h3 className="font-semibold text-red-600">

🚨 {alert.title}

</h3>

<p className="text-gray-600 mt-1">
  {alert.message}
</p>

<p className="text-sm text-red-500 mt-2 font-medium">
  ⚠ Please renew before expiry.
</p>

</div>

</div>

))

):(

<div className="text-center py-10 text-gray-500">

No Alerts 🎉

</div>

)}
</div>

</div>

</MainLayout>

);

}

export default Alerts;