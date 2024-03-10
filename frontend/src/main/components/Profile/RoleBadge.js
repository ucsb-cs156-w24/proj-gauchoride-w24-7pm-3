import React from 'react';
import { Badge } from "react-bootstrap";

export default function RoleBadge({role, currentUser}) {
   
  const roles = currentUser.root.roles.map( (o) => o.authority );

  const lcrole = role.replace("ROLE_","").toLowerCase();
  return (
     roles.includes(role) ?
        <Badge style = {{margin: '0 5px'}} className="bg-primary" data-testid={`role-badge-${lcrole}`}>{lcrole}</Badge> 
        :
        <span data-testid={`role-missing-${lcrole}`}></span>
  );
}