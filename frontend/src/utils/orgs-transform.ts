import { Organisation, OrganisationGroup } from "@/types/organisation";
import { organizeOrgs } from "./organizeOrgs";

const buildGroupHierarchy = (groups: OrganisationGroup[]): any[] => {
  const groupMap = new Map<number, any>(); // Store all groups by ID
  const rootGroups: any[] = []; // Store root-level groups

  // Initialize the map with group data
  groups.forEach((group: any) => {
    groupMap.set(group.id, {
      key: `group-${group.id}`,
      id: group.id,
      checkId: `${group.id}-${group.id}`,
      name: group.name,
      isGroup: true,
      isOrganisation: false,
      isSite: false,
      children: [], // This will hold nested children
    });
  });

  // Assign groups to their parent or root if no parentId
  groups.forEach((group: OrganisationGroup) => {
    const groupNode = groupMap.get(parseInt(group.id || ''));

    if (group.parentId && groupMap.has(parseInt(group.parentId))) {
      groupMap.get(parseInt(group.parentId))?.children.push(groupNode); // Assign to parent
    } else {
      rootGroups.push(groupNode); // No parent, so it's a root group
    }
  });

  return rootGroups;
};

const getGroupsAndSite = (groups: OrganisationGroup[]): any[] => {
  return groups.map((group: OrganisationGroup) => {
    // Initialize children array
    const children: any[] = [];

    // Recursively process nested groups
    if ((group as any)?.groups) {
      children.push(...getGroupsAndSite((group as any).groups));
    }

    // Add sites to children if available
    if ((group as any)?.sites) {
      children.push(
        ...(group as any).sites.map((site: any) => ({
          key: `site-${site.id}`,
          id: site.id,
          checkId: `${group.id}-${site.id}`,
          name: site.name,
          boxType: site.boxType,
          isGroup: false,
          isOrganisation: false,
          isSite: true,
        })),
      );
    }

    // Return the processed group with its children
    return {
      key: `group-${group.id}`,
      id: group.id,
      checkId: `${group.id}-${group.id}`,
      name: group.name,
      isGroup: true,
      isOrganisation: false,
      children: children.length > 0 ? children : null, // Include both groups and sites
    };
  });
};

export const TransformOrgs = (data: Organisation[]): any[] => {
  const organized = organizeOrgs(data);

  return organized.map((org: Organisation) => {
    // Process groups and sites for each organisation
    const children: any[] = [];

    // Add groups and their nested children
    if (org.groups) {
      children.push(...buildGroupHierarchy(org.groups));
    }

    // Add standalone sites
    if (org?.sites) {
      children.push(
        ...org.sites.map((site) => ({
          key: `site-${site.id}`,
          id: site.id,
          checkId: `${org.id}-${site.id}`,
          name: site.name,
          boxType: site.boxType,
          status: site.connectionState,
          isGroup: false,
          isSite: true,
          isOrganisation: false,
        })),
      );
    }

    // Return the organisation structure
    return {
      key: `org-${org.id}`,
      id: org.id,
      name: org.name,
      isOrganisation: true,
      isSite: false,
      isGroup: false,
      children: children.length > 0 ? children : null,
    };
  });
};
