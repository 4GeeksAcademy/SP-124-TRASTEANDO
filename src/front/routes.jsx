// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { AdminUsers } from "./pages/AdminUsers"
import { AdminUserCreate } from "./pages/AdminUserCreate";
import { AdminUserEdit } from "./pages/AdminUserEdit";
import { Companies } from "./pages/Companies";
import { CreateCompanies } from "./pages/CreateCompanies";
import { CompanyDetails } from "./pages/CompanyDetails";
import { Leases } from "./pages/Leases";
import { LeasesCreate } from "./pages/LeasesCreate";
import { LeasesEdit } from "./pages/LeasesEdit";
import { LeasesDetails } from "./pages/LeasesDetails";
import { AdminUserDetails } from "./pages/AdminUserDetails";
import { Location } from "./pages/Location";
import { LocationCreate } from "./pages/LocationCreate";
import { LocationDetails } from "./pages/LocationDetails";
import { LocationEdit } from "./pages/LocationsEdit";
import { ClientList } from "./pages/ClientList";
import { ClientCreate } from "./pages/ClientCreate";
import { ClientDetails } from "./pages/ClientDetails";
import { ClientEdit } from "./pages/ClientEdit";
import { StorageList } from "./pages/StorageList";
import { StorageCreate } from "./pages/StorageCreate";
import { StorageDetails } from "./pages/StorageDetails";
import { StorageEdit } from "./pages/StorageEdit";
import { ClientLogin } from "./pages/ClientLogin";
import { ClientPrivate } from "./pages/ClientPrivate";
import { Clients } from "./pages/Clients";
import { CompanyLogin } from "./pages/CompanyLogin";
import { CompanyPrivate } from "./pages/CompanyPrivate";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminPrivate } from "./pages/AdminPrivate";
import { ClientSignup } from "./pages/ClientSignup";
import { ClientLocations } from "./pages/ClientLocations";
import { StoragesPrivateDetails } from "./pages/StoragesPrivateDetails";
import { StoragesPrivateList } from "./pages/StoragesPrivateList";
import { StoragePrivateCheckout } from "./pages/StoragePrivateCheckout";
import { CompanyLocations } from "./pages/CompanyLocations";
import { CompanyStorages } from "./pages/CompanyStorages";
import { CompanyStoragesDetails } from "./pages/CompanyStoragesDetails";
import { CompanyLocationsCreate } from "./pages/CompanyLocationsCreate";
import { AdminProtectedRoute } from "./pages/AdminProtectedRoute";
import { CompanyProtectedRoute } from "./pages/CompanyProtectedRoute";
import { ClientProtectedRoute } from "./pages/ClientProtectedRoute";
import { CompanyLocationsDetails } from "./pages/CompanyLocationsDetails";
import { CompanyLocationsEdit } from "./pages/CompanyLocationsEdit";
import { CompanyStoragesCreate } from "./pages/CompanyStoragesCreate";
import { CompanyStoragesEdit } from "./pages/CompanyStoragesEdit";
import { CompanyLocationStorages } from "./pages/CompanyLocationStorages";
import { ClientPrivateLeases } from "./pages/ClientePrivateLeases";
import { SearchHome } from "./pages/SearchHome";
import { Map } from "./pages/Map";
import { CompanyPrivateEdit } from "./pages/CompanyPrivateEdit";
import { CompanyEdit } from "./pages/CompanyEdit";
import { LocationPublic } from "./pages/LocationPublic";
import { Chat } from "./pages/Chat";
import { SubscriptionCheckout } from "./pages/SubscriptionCheckout";
import { PaymentSuccess } from "./pages/PaymentSucess";
import { PaymentCancel } from "./pages/PaymentCancel";
import { Inventariator } from "./pages/Inventariator";
import { ClientDashboardLayout } from "../layouts/ClientDashboardLayout";
import { CompanyDashboardLayout } from "../layouts/CompanyDashboardLayout";
import { AdminDashboardLayout } from "../layouts/AdminDashboardLayout";
import { AboutUs } from "./pages/AboutUs";
import { Features } from "./pages/Features";
import { PaymentDetails } from "./pages/PaymentDetails";
import { DeleteProfile } from "./pages/DeleteProfile";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
      <Route path="/" element={<Home />} />
      {/* ruta para el search de home */}
      <Route path="/search" element={<SearchHome />} />
      <Route path="/search/map" element={<Map />} />
      <Route path="/aboutUs" element={<AboutUs />} />
      <Route path="/features" element={<Features />} />

      <Route path="/client/private/storage/:storageId" element={<StoragesPrivateDetails />} />

      {/* Rutas adminUser */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Rutas client */}
      <Route path="/client/login" element={<ClientLogin />} />
      <Route path="/client/signup" element={<ClientSignup />} />

      {/* Rutas messages */}
      <Route path="/chat" element={<Chat />} />

      {/* Rutas company */}
      <Route path="/companies" element={<Companies />} />
      <Route path="/createCompanies" element={<CreateCompanies />} />
      <Route path="/companies/:id" element={<CompanyDetails />} />
      <Route path="/companies/:id/edit" element={<CompanyEdit />} />
      <Route path="/companies/login" element={<CompanyLogin />} />
      <Route path="/companies/private/edit" element={<CompanyPrivateEdit />} />
      <Route path="/companies/private/locations" element={<CompanyLocations />} />
      <Route path="/companies/private/locations/create" element={<CompanyLocationsCreate />} />
      <Route path="/companies/private/locations/:id" element={<CompanyLocationsDetails />} />
      <Route path="/companies/private/locations/edit/:location_id" element={<CompanyLocationsEdit />} />
      <Route path="/companies/private/locations/storages/:id" element={<CompanyLocationStorages />} />
      <Route path="/companies/private/storages" element={<CompanyStorages />} />
      <Route path="/companies/private/storages/create" element={<CompanyStoragesCreate />} />
      <Route path="/companies/private/storages/edit/:storage_id" element={<CompanyStoragesEdit />} />
      <Route path="/companies/private/storages/:id" element={<CompanyStoragesDetails />} />

      {/* Rutas location */}
      <Route path="/location-create" element={<LocationCreate />} />
      <Route path="/location-details/:id" element={<LocationDetails />} />
      <Route path="/client/private/locations" element={<ClientLocations />} />
      <Route path="/location-edit/:id" element={<LocationEdit />} />
      <Route path="/locations-public" element={<LocationPublic />} />

      {/* Rutas storage */}
      <Route path="/storages" element={<StorageList />} />
      <Route path="/storages/create" element={<StorageCreate />} />
      <Route path="/storages/:id/edit" element={<StorageEdit />} />
      <Route path="/storages/:id" element={<StorageDetails />} />
      <Route path="/client/private/storages/:locationId" element={<StoragesPrivateList />} />

      {/* ==== Rutas Protegidas Solo Admin ==== */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-create" element={<AdminUserCreate />} />
        <Route path="/admin-edit" element={<AdminUserEdit />} />
        <Route path="/admin-details/:id" element={<AdminUserDetails />} />
        <Route path="/clients-info" element={<Clients />} />
        {/* <Route path="/companies" element={<Companies />} /> */}
        <Route path="/location" element={<Location />} />
        <Route path="/admin/private" element={<AdminPrivate />} />
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/new" element={<ClientCreate />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
      </Route>

      {/* ==== Rutas Protegidas Solo Company ==== */}
      <Route element={<CompanyProtectedRoute />}>
        <Route path="/companies/private" element={<CompanyPrivate />} />
      </Route>

      {/* ==== Rutas Protegidas Solo Client ==== */}
      <Route element={<ClientProtectedRoute />}>
        <Route path="/clients/:id/edit" element={<ClientEdit />} />
        <Route path="/client/private" element={<ClientPrivate />} />
        <Route path="/client/private/leases" element={<ClientPrivateLeases />} />
        <Route path="/client/private/checkout/:storageId" element={<StoragePrivateCheckout />} />
        <Route path="/client/private/storage/:storageId" element={<StoragesPrivateDetails />} />
        <Route path="/inventariator" element={<Inventariator />} />
      </Route>

      {/* ==== Rutas Stripe ==== */}
      <Route path="/checkout" element={<SubscriptionCheckout />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/cancel" element={<PaymentCancel />} />

      {/* ==== DASHBOARD CLIENT (PARALELO) ==== */}
      <Route element={<ClientProtectedRoute />}>
        <Route path="/client/dashboard" element={<ClientDashboardLayout />}>
          <Route index element={<ClientPrivate />} />
          <Route path="profile" element={<ClientPrivate />} />
          <Route path="leases" element={<ClientPrivateLeases />} />
          <Route path="inventory" element={<Inventariator />} />
          <Route path="paymentdetails" element={<PaymentDetails />} />
          <Route path="chat" element={<Chat />} />
          <Route path="deleteprofile" element={<DeleteProfile />} />
        </Route>
      </Route>

      {/* ==== DASHBOARD COMPANY (PARALELO) ==== */}
      <Route element={<CompanyProtectedRoute />}>
        <Route path="/company/dashboard" element={<CompanyDashboardLayout />}>
          <Route index element={<CompanyPrivate />} />
          <Route path="locations" element={<CompanyLocations />} />
          <Route path="storages" element={<CompanyStorages />} />
          <Route path="storages/:id" element={<CompanyStoragesDetails />} />
          <Route path="storages/edit/:storage_id" element={<CompanyStoragesEdit />} />
          <Route path="locations/:id" element={<CompanyLocationsDetails />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Route>

      {/* ==== DASHBOARD ADMIN (PARALELO) ==== */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>
          <Route index element={<AdminPrivate />} />
          <Route path="private" element={<AdminPrivate />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="companies" element={<Companies />} />
          <Route path="clients" element={<ClientList />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />

      {/* <Route path="/leases" element={<Leases />} /> */}
      {/* <Route path="/leasesCreate" element={<LeasesCreate />} />
        <Route path="/leasesEdit/:id" element={<LeasesEdit />} />
        <Route path="/leasesDetails/:id" element={<LeasesDetails />} /> */}

    </Route >
  )
);