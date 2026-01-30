import { authKit } from '@workos/authkit-sveltekit';
import { prisma } from '$lib/db';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = authKit.withAuth(async ({ auth }) => {
  const products = await prisma.product.findMany({
    take: 50,
  });

  return {
    user: auth.user,
    admin: auth.role == "admin" ? true : false,
    products
  }
});

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const session = locals.auth;
    
    if (session?.role !== 'admin') {
      return fail(403, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    const manufacturer = formData.get('manufacturer')?.toString();
    const category = formData.get('category')?.toString();
    const productName = formData.get('productName')?.toString();
    const sku = formData.get('sku')?.toString();
    const synnexNumber = formData.get('synnexNumber')?.toString() || null;
    const price = parseFloat(formData.get('price')?.toString() || '0');
    const msrp = parseFloat(formData.get('msrp')?.toString() || '0');
    const extendedPrice = parseFloat(formData.get('extendedPrice')?.toString() || '0');
    const shipping = parseFloat(formData.get('shipping')?.toString() || '0');

    if (!manufacturer || !category || !productName || !sku) {
      return fail(400, { error: 'Missing required fields' });
    }

    try {
      await prisma.product.create({
        data: {
          id: crypto.randomUUID(),
          manufacturer,
          category,
          productName,
          sku,
          synnexNumber,
          price,
          msrp,
          extendedPrice,
          shipping
        }
      });

      return { success: true };
    } catch (err) {
      return fail(500, { error: 'Failed to create product' });
    }
  },

  edit: async ({ request, locals }) => {
    const session = locals.auth;
    
    if (session?.role !== 'admin') {
      return fail(403, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    const manufacturer = formData.get('manufacturer')?.toString();
    const category = formData.get('category')?.toString();
    const productName = formData.get('productName')?.toString();
    const sku = formData.get('sku')?.toString();
    const synnexNumber = formData.get('synnexNumber')?.toString() || null;
    const price = parseFloat(formData.get('price')?.toString() || '0');
    const msrp = parseFloat(formData.get('msrp')?.toString() || '0');
    const extendedPrice = parseFloat(formData.get('extendedPrice')?.toString() || '0');
    const shipping = parseFloat(formData.get('shipping')?.toString() || '0');

    if (!id || !manufacturer || !category || !productName || !sku) {
      return fail(400, { error: 'Missing required fields' });
    }

    try {
      await prisma.product.update({
        where: { id },
        data: {
          manufacturer,
          category,
          productName,
          sku,
          synnexNumber,
          price,
          msrp,
          extendedPrice,
          shipping
        }
      });

      return { success: true };
    } catch (err) {
      return fail(500, { error: 'Failed to update product' });
    }
  }
};
