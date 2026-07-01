'use client';

import Link from "next/link";
import { forwardRef } from "react";

// Bọc Link bằng forwardRef để MUI có thể tương tác với nó mà không gây lỗi
import type { LinkProps } from "next/link";

const NavLink = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  return <Link ref={ref} {...props} />;
});

NavLink.displayName = 'NavLink';
export default NavLink;