import { type FC, useMemo } from "react";

import { DescriptionList, DescriptionListItem } from "@/description-list";
import { OrganisationSite } from "@/types/organisation";
import {
  ContactsOutlined,
  MailOutlined,
  PoweroffOutlined
} from "@ant-design/icons";
import { Card, Space, Tag, Typography } from "antd";

type Props = {
  site: OrganisationSite | any;
  className?: string;
  dataTestId?: string;
  darkTheme?: boolean;
};

export const SiteInfoListMap: FC<Props> = ({
  site,
  className,
  dataTestId,
}) => {
  // TODO: Get rest info from BE
  const items = useMemo<DescriptionListItem[]>(
    () => [
      {
        label: "Site Status",
        value: (
          <Space size="small">
            {/* {event.obj.key} */}
            <Tag color={site.connectionState ? "green-inverse" : "red-inverse"}> <PoweroffOutlined /> { site.connectionState ? "Online" : "Offline" } </Tag>
          </Space>
        ),
      },
      { label: "Box type", value:  <Tag color={(site.boxType == 1) ? "orange" : "cyan"}> { (site.boxType == 1) ? "Lite Version" : "Standard Version" } </Tag> },
      { label: "Site ID", value: site.id },
      { label: "Site Name", value: site.name },
      { label: "Site Address", value: site.address },
      { label: "Start Date and Time", value: site.activate || "N/A" },
      { label: "End Date and Time", value: site.deactivate || "N/A" },
      { label: "Sim Card Expiration", value: site.simExpirationTime || "N/A" },
      { label: "Remark", value: site.remark || "N/A" },
    ],
    [],
  );

  const contactDetails = [
    {
      index: 1,
      contactEmail: site.contactEmail || "N/A",
      contactPerson: site.contactPerson || "N/A",
      contactPhoneNum: site.contactPhoneNum || "N/A",
    },
    {
      index: 2,
      contactEmail: site.contactEmail2 || "N/A",
      contactPerson: site.contactPerson2 || "N/A",
      contactPhoneNum: site.contactPhoneNum2 || "N/A",
    },
  ]
  return (
    <>
      <DescriptionList
        className={className}
        title="Site Info"
        items={items}
        dataTestId={dataTestId}
      />

      {
        contactDetails.map(contact => <ContactCard contact={contact} />)
      }
    </>
  );
};

const ContactCard = ({ contact }: { contact: any }) => {
  return (
    <>
      <Typography.Text>
        Contact {contact.index}
      </Typography.Text>
      <Card className="contact_card">
        <p>{contact.contactPerson}</p>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <ContactsOutlined />
          {contact.contactPhoneNum}
        </div>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <MailOutlined />
          {contact.contactEmail}
        </div>
      </Card>
    </>
  );
};
