const Quote = () => {
  return (
    <section
      id="quote"
      className="bg-warm-beige py-24 text-center text-charcoal px-6"
    >
      <p 
        className="font-headline text-2xl md:text-3xl leading-snug max-w-4xl mx-auto tracking-[-0.02em]"
        data-en="Comfort crafted for refined taste"
        data-ar="راحة مصنوعة للذوق الرفيع"
      >
        Comfort crafted for refined taste
      </p>
      <p 
        className="mt-6 font-body text-lg text-bronze"
        data-en="Dandle Store Group · Crafting Since 2010"
        data-ar="مجموعة متاجر Dandle · نصنع منذ 2010"
      >
        Dandle Store Group · Crafting Since 2010
      </p>
    </section>
  );
};

export default Quote;
