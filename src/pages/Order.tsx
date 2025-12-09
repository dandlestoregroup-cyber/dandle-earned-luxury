import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Truck, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface OrderNode {
  name: string;
  createdAt: string;
  displayFulfillmentStatus: string;
  customer: {
    displayName: string;
    phone: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant: {
          price: string;
          image: { url: string } | null;
        };
      };
    }>;
  };
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
}

const fetchOrder = async (ref: string): Promise<OrderNode | null> => {
  const storeUrl = import.meta.env.VITE_SHOPIFY_STORE_URL;
  const accessToken = import.meta.env.VITE_SHOPIFY_ACCESS_TOKEN;

  if (!storeUrl || !accessToken) {
    console.error('Shopify credentials not configured');
    return null;
  }

  const query = `{
    orders(first:1, query:"name:${ref}") {
      edges {
        node {
          name
          createdAt
          displayFulfillmentStatus
          customer {
            displayName
            phone
          }
          lineItems(first:10) {
            edges {
              node {
                title
                quantity
                variant {
                  price
                  image {
                    url
                  }
                }
              }
            }
          }
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }`;

  try {
    const res = await fetch(`https://${storeUrl}/admin/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({ query })
    });

    if (!res.ok) {
      throw new Error(`Shopify API returned ${res.status}`);
    }

    const data = await res.json();
    const edges = data?.data?.orders?.edges;

    if (!edges || edges.length === 0) {
      return null;
    }

    return edges[0].node;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

export default function Order() {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', reference],
    queryFn: () => fetchOrder(reference!),
    enabled: !!reference
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="mr-3 text-muted-foreground">جاري التحميل...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-headline mb-4">الطلب غير موجود</h1>
            <p className="text-muted-foreground mb-6">
              الطلب {reference} غير موجود في النظام
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة للصفحة الرئيسية
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const delivery = new Date(order.createdAt);
  delivery.setDate(delivery.getDate() + 14);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة للتسوق
          </Button>

          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4 font-headline">طلب {order.name}</h1>

            {order.customer && (
              <div className="mb-4">
                <h2 className="font-semibold">العميل</h2>
                <p>{order.customer.displayName}</p>
                {order.customer.phone && <p>{order.customer.phone}</p>}
              </div>
            )}

            <div className="mb-4">
              <h2 className="font-semibold mb-2">المنتجات</h2>
              {order.lineItems.edges.map(({ node }, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  {node.variant.image && (
                    <img
                      src={node.variant.image.url}
                      className="w-16 h-16 rounded object-cover"
                      alt={node.title}
                    />
                  )}
                  <div>
                    <p>{node.title}</p>
                    <p className="text-sm text-gray-600">
                      {node.quantity} × {node.variant.price} جنيه
                    </p>
                  </div>
                </div>
              ))}
              <p className="font-bold mt-4">
                الإجمالي: {order.totalPriceSet.shopMoney.amount} {order.totalPriceSet.shopMoney.currencyCode}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5" />
              <span>{order.displayFulfillmentStatus || 'قيد المعالجة'}</span>
            </div>

            <p className="text-sm text-gray-600">
              التوصيل المتوقع: {delivery.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
