import { Organisation, OrganisationGroup, OrganisationSite } from "@/types/organisation";

export const organizeOrgs = (data: any) => {
    if ( !data ) {
        return null;
    }
        return data.map((item:Organisation) => {
            const groupsById = item.groups
                ? item.groups.reduce<Record<string, OrganisationGroup & { sites: OrganisationSite[] }>>((acc, group) => {
                      acc[group?.id || ''] = { ...group, sites: [] };
                      return acc;
                  }, {})
                : {};

            const ungroupedSites:any = [];
    
            if ( item.sites )
            {
                item.sites.map((site: OrganisationSite) => {
                    const groupId = site.groupId;
                    if (groupsById[groupId]) {
                        groupsById[groupId].sites.push(site);
                    } else {
                        ungroupedSites.push(site);
                    }
                });
            }
    
            return {
                ...item,
                groups: item.groups
                    ? Object.values(groupsById)
                    : null,
                sites: ungroupedSites.length > 0 ? ungroupedSites : null,
            };
        });
}