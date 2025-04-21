
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyCriteria } from "./CompanyCriteria";
import { ContactCriteria } from "./ContactCriteria";
import { EngagementRules } from "./EngagementRules";

export function ICPBuilder() {
  const [icpName, setIcpName] = useState("My ICP");
  const [companySize, setCompanySize] = useState([50, 1000]);
  const [includeDecisionMakers, setIncludeDecisionMakers] = useState(true);
  const [messagingFramework, setMessagingFramework] = useState<"aida" | "4t">("aida");

  return (
    <Tabs defaultValue="company" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="company">Company Criteria</TabsTrigger>
        <TabsTrigger value="contact">Contact Criteria</TabsTrigger>
        <TabsTrigger value="engagement">Engagement Rules</TabsTrigger>
      </TabsList>

      <TabsContent value="company">
        <CompanyCriteria 
          icpName={icpName}
          setIcpName={setIcpName}
          companySize={companySize}
          setCompanySize={setCompanySize}
        />
      </TabsContent>
      <TabsContent value="contact">
        <ContactCriteria 
          includeDecisionMakers={includeDecisionMakers}
          setIncludeDecisionMakers={setIncludeDecisionMakers}
        />
      </TabsContent>
      <TabsContent value="engagement">
        <EngagementRules 
          messagingFramework={messagingFramework}
          setMessagingFramework={setMessagingFramework}
        />
      </TabsContent>
    </Tabs>
  );
}
