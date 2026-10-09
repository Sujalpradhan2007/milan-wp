import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  real,
  index,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/*  Users & roles                                                      */
/* ------------------------------------------------------------------ */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("content_manager"), // super_admin | sales_manager | content_manager
  phone: text("phone"),
  avatar: text("avatar"),
  active: boolean("active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  Site settings (key / value JSON store)                             */
/* ------------------------------------------------------------------ */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  Machines                                                           */
/* ------------------------------------------------------------------ */
export const machines = pgTable(
  "machines",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").notNull().default("Paper Plate Machine"),
    t: jsonb("t").notNull().default({}), // { en:{name,tagline,short,full,features[]}, hi:{}, or:{} }
    mrp: real("mrp").notNull().default(0),
    companyPrice: real("company_price").notNull().default(0),
    offerPrice: real("offer_price").notNull().default(0),
    discount: real("discount").notNull().default(0),
    coverImage: text("cover_image"),
    media: jsonb("media").notNull().default([]), // [{type:'image'|'video',url,caption}]
    models: jsonb("models").notNull().default([]), // [{id,name,code,capacity,pph,price,active}]
    colors: jsonb("colors").notNull().default([]), // [{id,name,hex,imageUrl}]
    specs: jsonb("specs").notNull().default([]), // [{group,label,value}]
    capacity: text("capacity"),
    productionPerHour: integer("production_per_hour").notNull().default(0),
    power: text("power"),
    warranty: text("warranty"),
    active: boolean("active").notNull().default(true),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    views: integer("views").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("machines_active_idx").on(t.active), index("machines_sort_idx").on(t.sortOrder)]
);

/* ------------------------------------------------------------------ */
/*  Raw materials                                                      */
/* ------------------------------------------------------------------ */
export const rawMaterials = pgTable("raw_materials", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  t: jsonb("t").notNull().default({}),
  image: text("image"),
  price: real("price").notNull().default(0),
  mrp: real("mrp").notNull().default(0),
  unit: text("unit").notNull().default("kg"),
  stock: integer("stock").notNull().default(0),
  lowStockAt: integer("low_stock_at").notNull().default(10),
  grade: text("grade"),
  gsm: text("gsm"),
  specs: jsonb("specs").notNull().default([]),
  active: boolean("active").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  Spare parts                                                        */
/* ------------------------------------------------------------------ */
export const spareParts = pgTable("spare_parts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  partCode: text("part_code").notNull().unique(),
  t: jsonb("t").notNull().default({}),
  machineId: integer("machine_id"),
  machineName: text("machine_name"),
  image: text("image"),
  gallery: jsonb("gallery").notNull().default([]),
  price: real("price").notNull().default(0),
  mrp: real("mrp").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  availability: text("availability").notNull().default("in_stock"), // in_stock|low_stock|out_of_stock|on_order
  material: text("material"),
  warranty: text("warranty"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  Festivals                                                          */
/* ------------------------------------------------------------------ */
export const festivals = pgTable("festivals", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  t: jsonb("t").notNull().default({}),
  festivalDate: timestamp("festival_date").notNull(),
  daysBefore: integer("days_before").notNull().default(5),
  bannerUrl: text("banner_url"),
  bgImage: text("bg_image"),
  colorA: text("color_a").notNull().default("#ff5a10"),
  colorB: text("color_b").notNull().default("#7922fc"),
  offerText: jsonb("offer_text").notNull().default({}),
  discount: real("discount").notNull().default(0),
  couponCode: text("coupon_code"),
  enabled: boolean("enabled").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  Offers                                                             */
/* ------------------------------------------------------------------ */
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  t: jsonb("t").notNull().default({}),
  machineId: integer("machine_id"),
  machineName: text("machine_name"),
  coverImage: text("cover_image"),
  bgImage: text("bg_image"),
  mrp: real("mrp").notNull().default(0),
  companyPrice: real("company_price").notNull().default(0),
  offerPrice: real("offer_price").notNull().default(0),
  discount: real("discount").notNull().default(0),
  includedItems: jsonb("included_items").notNull().default([]), // [{name,photo,qty}]
  festivalId: integer("festival_id"),
  festivalName: text("festival_name"),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date").notNull().defaultNow(),
  couponCode: text("coupon_code"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  Gallery                                                            */
/* ------------------------------------------------------------------ */
export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default(""),
  t: jsonb("t").notNull().default({}),
  description: text("description"),
  category: text("category").notNull().default("factory"), // factory|products|customers|team
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  category: text("category").notNull().default("general"),
  t: jsonb("t").notNull().default({}), // { en:{q,a}, hi:{q,a}, or:{q,a} }
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/*  Enquiries                                                          */
/* ------------------------------------------------------------------ */
export const enquiries = pgTable(
  "enquiries",
  {
    id: serial("id").primaryKey(),
    type: text("type").notNull().default("general"), // machine|raw_material|offer|service|general|spare
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    city: text("city"),
    state: text("state"),
    message: text("message"),
    machineId: integer("machine_id"),
    machineName: text("machine_name"),
    model: text("model"),
    color: text("color"),
    capacity: text("capacity"),
    price: real("price"),
    itemId: integer("item_id"),
    itemName: text("item_name"),
    status: text("status").notNull().default("new"), // new|contacted|quoted|won|lost
    assignedTo: integer("assigned_to"),
    assignedName: text("assigned_name"),
    source: text("source").default("website"),
    notes: jsonb("notes").notNull().default([]), // [{text,by,at}]
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("enq_status_idx").on(t.status), index("enq_created_idx").on(t.createdAt)]
);

/* ------------------------------------------------------------------ */
/*  Support tickets                                                    */
/* ------------------------------------------------------------------ */
export const tickets = pgTable(
  "tickets",
  {
    id: serial("id").primaryKey(),
    ticketNumber: text("ticket_number").notNull().unique(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    city: text("city"),
    machineId: integer("machine_id"),
    machineName: text("machine_name"),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    priority: text("priority").notNull().default("medium"), // low|medium|high|urgent
    status: text("status").notNull().default("open"), // open|in_progress|waiting|resolved|closed
    assignedTo: integer("assigned_to"),
    assignedName: text("assigned_name"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("ticket_status_idx").on(t.status)]
);

export const ticketUpdates = pgTable(
  "ticket_updates",
  {
    id: serial("id").primaryKey(),
    ticketId: integer("ticket_id").notNull(),
    status: text("status"),
    message: text("message").notNull(),
    byAdmin: boolean("by_admin").notNull().default(false),
    authorName: text("author_name"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("upd_ticket_idx").on(t.ticketId)]
);

/* ------------------------------------------------------------------ */
/*  Analytics, newsletter, activity log                                */
/* ------------------------------------------------------------------ */
export const events = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    type: text("type").notNull(), // page_view|machine_view|raw_view|offer_view|spare_view|gallery_view|whatsapp_click|enquiry|ticket|newsletter|roi_calc
    path: text("path"),
    entityId: integer("entity_id"),
    entityName: text("entity_name"),
    lang: text("lang").default("en"),
    device: text("device"),
    source: text("source"),
    country: text("country"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("ev_type_idx").on(t.type), index("ev_created_idx").on(t.createdAt)]
);

export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  actor: text("actor").notNull().default("system"),
  action: text("action").notNull(),
  entity: text("entity"),
  entityName: text("entity_name"),
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
