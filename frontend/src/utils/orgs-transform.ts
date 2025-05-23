import { Organisation, OrganisationGroup } from "@/types/organisation";
import { organizeOrgs } from "./organizeOrgs";

interface GroupNode extends OrganisationGroup {
  key: string;
  checkId: string;
  name: string;
  isGroup: boolean;
  isOrganisation: boolean;
  isSite: boolean;
  children?: GroupNode[];
  parentId?: string;
}

interface SiteNode {
  key: string;
  id: string;
  checkId: string;
  name: string;
  boxType?: number;
  status?: boolean;
  isGroup: false;
  isOrganisation: false;
  isSite: true;
}

export type GroupOrSiteNode = GroupNode | SiteNode;

interface GroupNodeWithChildren extends GroupNode {
  groups?: OrganisationGroup[];
  sites?: SiteNode[];
}

const buildGroupHierarchy = (groups: OrganisationGroup[]): GroupNode[] => {
  const groupArray: GroupNode[] = groups.map((group) => ({
    key: `group-${group.id}`,
    id: group.id,
    checkId: `${group.id}-${group.id}`,
    name: group.name || "",
    isGroup: true,
    isSite: false,
    isOrganisation: false,
    parentId: group.parentId,
  }));

  const rootGroups = groupArray.filter((group) => !group.parentId);

  groupArray.forEach((group) => {
    if (group.parentId) {
      const parent = groupArray.find((g) => g.id === group.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push({ ...group, isGroup: false, isSite: true });
      }
    }
  });

  return rootGroups;
};

const getGroupsAndSite = (
  groups: GroupNodeWithChildren[],
): GroupOrSiteNode[] => {
  return groups.map((group: GroupNodeWithChildren) => {
    // Initialize children array
    const children: GroupOrSiteNode[] = [];

    // Recursively process nested groups
    if (group.groups && Array.isArray(group.groups)) {
      children.push(...getGroupsAndSite((group as any).groups));
    }

    // Add sites to children if available
    if (group.sites && Array.isArray(group.sites)) {
      children.push(...group.sites);
    }

    // Return the processed group with its children
    return {
      key: group.key,
      id: group.id,
      checkId: group.checkId,
      name: group.name || "",
      isGroup: true,
      isOrganisation: false,
      isSite: false,
      children: children.length > 0 ? children : [], // Include both groups and sites
      parentId: group.parentId,
    } as GroupNode;
  });
};

export const TransformOrgs = (data: Organisation[]): GroupOrSiteNode[] => {
  const organized = organizeOrgs(data);

  return organized.map((org: Organisation) => {
    // Process groups and sites for each organisation
    const children: GroupOrSiteNode[] = [];

    // Add groups and their nested children
    if (org.groups) {
      children.push(...buildGroupHierarchy(org.groups));
    }

    // Add standalone sites
    if (org?.sites) {
      children.push(
        ...org.sites.map(
          (site) =>
            ({
              key: `site-${site.id}`,
              id: site.id,
              checkId: `${org.id}-${site.id}`,
              name: site.name,
              boxType: site.boxType,
              status: site.connectionState,
              isGroup: false,
              isSite: true,
              isOrganisation: false,
            }) as SiteNode,
        ),
      );
    }

    // Return the organisation structure
    return {
      key: `org-${org.id}`,
      id: org.id,
      name: org.name || "",
      isOrganisation: true,
      isSite: false,
      isGroup: false,
      children: children.length > 0 ? children : [],
    };
  });
};
