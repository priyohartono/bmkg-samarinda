import Breadcrumb from "@/components/Breadcrumb";
import HariTanpaHujanContent from "@/components/component-iklim/HariTanpaHujanContent";

export default function HariTanpaHujanPage() {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Iklim", href: "/iklim" },
          { label: "Hari Tanpa Hujan" },
        ]}
      />
      <HariTanpaHujanContent />
    </div>
  );
}
