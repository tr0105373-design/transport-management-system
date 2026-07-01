import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import api from "../services/api";

function Activity() {

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {

      const response = await api.get("/activity");

      setActivities(response.data || []);

    } catch (error) {

      console.log(error);

    }
  };

  const deleteActivity = async (id) => {

  if (!window.confirm("Delete this activity?")) return;

  try {

    await api.delete(`/activity/${id}`);

    fetchActivities();

  } catch (error) {

    console.log(error);

  }

};

const clearAllActivities = async () => {

  if (!window.confirm("Clear all activities?")) return;

  try {

    await api.delete("/activity");

    fetchActivities();

  } catch (error) {

    console.log(error);

  }

};

  return (

<MainLayout>

<div className="mb-8">

<h1 className="text-3xl font-bold">
Recent Activity
</h1>

<p className="text-gray-500 mt-1">
View all recent activities in the system.
</p>

</div>
<div className="bg-white rounded-2xl shadow-md overflow-hidden">

<div className="p-6 border-b flex justify-between items-center">

  <h2 className="text-xl font-semibold">
    Recent Activities
  </h2>

  <button
    onClick={clearAllActivities}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
  >
    Clear All
  </button>

</div>

<div className="divide-y">
  {activities.length > 0 ? (

activities.map((activity) => (

<div
key={activity.id}
className="p-5 hover:bg-gray-50"
>

<div className="flex justify-between items-center">

  <h3 className="font-semibold">
    {activity.action}
  </h3>

  <button
    onClick={() => deleteActivity(activity.id)}
    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
  >
    Delete
  </button>

</div>

<p className="text-gray-600 mt-1">

{activity.description}

</p>

<p className="text-sm text-gray-400 mt-2">

{new Date(activity.created_at).toLocaleTimeString("en-IN", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
})}
</p>

</div>

))

) : (

<div className="text-center py-10 text-gray-500">

No Activity Found

</div>

)}
</div>

</div>

</MainLayout>

);

}

export default Activity;