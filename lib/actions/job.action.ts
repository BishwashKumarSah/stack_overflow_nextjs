import axios from "axios";
import { redirect } from "next/navigation";
interface JobDetailsParam {
  searchQuery?: string;
  filter?: string;
  page?: number;
  pageSize?: number;
}

export const getJobDetails = async ({
  searchQuery = "",
  filter = "in",
  pageSize = 10,
}: JobDetailsParam) => {
  try {
    const data = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/${filter}/search/1?app_id=42d3d41e&app_key=49ecfa5652e728981d1c3729772e0e98&results_per_page=100&title_only=${searchQuery}&sort_by=date`
    );

    const array = data.data.results.map((data: any) => {
      return {
        _id: data.id,
        url: data.redirect_url,
        title: data.title,
        type: data.contract_type ? data.contract_type : "Not Disclosed",
        description: data.description,
        location: data.location.area,
        createdAt: data.created,
        salary:
          data.salary_is_predicted === "0"
            ? "Not Disclosed"
            : data.salary_is_predicted,
        companyName: data.company.display_name,
      };
    });

    const totalButtons = Math.ceil(array.length / pageSize);
    return { jobDetails: array, totalButtons };
  } catch (error) {
    console.log("Error fetching Job Details", error);
    redirect("/");
  }
};
